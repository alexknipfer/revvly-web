import { Button } from '@/components/ui/button';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/tanstack-react-start';
import { getAuth } from '@clerk/tanstack-react-start/server';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';

const getCount = createServerFn({
  method: 'GET',
}).handler(async () => {
  const request = getWebRequest();
  const auth = await getAuth(request);
  console.log('auth: ', auth);
  return Promise.resolve(2);
});

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  return (
    <div className="py-2.5">
      <SignedIn>
        <p>You are signed in</p>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <p>You are signed out</p>
        <SignInButton>
          <Button>Login</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
