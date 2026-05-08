export type ToastType = 'success' | 'error' | 'loading' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: Listener[] = [];
let counter = 0;

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

function add(message: string, type: ToastType, duration = 3500): string {
  const id = String(++counter);
  toasts = [...toasts, { id, message, type, duration }];
  notify();

  if (duration > 0) {
    setTimeout(() => remove(id), duration);
  }
  return id;
}

function remove(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export const toast = {
  success: (msg: string, duration?: number) => add(msg, 'success', duration),
  error: (msg: string, duration?: number) => add(msg, 'error', duration ?? 5000),
  loading: (msg: string) => add(msg, 'loading', 0),
  info: (msg: string, duration?: number) => add(msg, 'info', duration),
  dismiss: (id: string) => remove(id),
  subscribe: (fn: Listener) => {
    listeners = [...listeners, fn];
    fn([...toasts]);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  },
};

// Async helper: shows loading toast, resolves to result or shows error
export async function withToast<T>(
  promise: Promise<T>,
  messages: { loading: string; success: string }
): Promise<T> {
  const id = toast.loading(messages.loading);
  try {
    const result = await promise;
    toast.dismiss(id);
    toast.success(messages.success);
    return result;
  } catch (e: unknown) {
    toast.dismiss(id);
    toast.error((e as Error).message || 'Something went wrong');
    throw e;
  }
}
