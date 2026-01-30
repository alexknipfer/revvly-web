import type { ReactElement } from 'react';

import { SignInButton } from '@clerk/tanstack-react-start';

interface Props {
  children: ReactElement;
}

export function SignInToVehiclesButton({ children }: Props) {
  return (
    <SignInButton
      forceRedirectUrl="/vehicles"
      signUpForceRedirectUrl="/vehicles"
    >
      {children}
    </SignInButton>
  );
}
