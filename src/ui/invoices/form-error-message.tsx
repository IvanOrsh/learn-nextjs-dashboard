type FormErrorMessageProps = {
  id: string;
  errors?: string[];
};

export const FormErrorMessage = ({ id, errors }: FormErrorMessageProps) =>
  errors ? (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors.map((err: string) => (
        <p key={err} className="mt-2 text-sm text-red-500">
          {err}
        </p>
      ))}
    </div>
  ) : null;
