'use client';

import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './button';

type SubmitButtonProps = {
  className?: string;
};

export default function SubmitButton({
  children,
  className,
}: PropsWithChildren<SubmitButtonProps>) {
  const { pending } = useFormStatus();

  return (
    <Button className={clsx(className)} aria-disabled={pending}>
      {children}
    </Button>
  );
}
