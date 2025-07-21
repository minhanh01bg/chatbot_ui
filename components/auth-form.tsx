import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultIdentifier = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultIdentifier?: string;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="identifier"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Username or email
        </Label>

        <Input
          id="identifier"
          name="identifier"
          className="bg-muted text-md md:text-sm"
          type="text"
          placeholder="your username or email"
          autoComplete="identifier"
          required
          autoFocus
          defaultValue={defaultIdentifier}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        />
      </div>

      {children}
    </Form>
  );
}
