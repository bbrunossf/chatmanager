import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="system"
      richColors
      closeButton
      position="bottom-right"
      className="toaster group"
      {...props}
    />
  );
}

export { Toaster };
