import { UserProfile } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/account')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <UserProfile
      routing="hash"
      appearance={{
        variables: {
          colorPrimary: 'var(--primary)',
          colorBackground: 'var(--background)',
          colorText: 'var(--foreground)',
          colorTextSecondary: 'var(--muted-foreground)',
          colorInputBackground: 'var(--input)',
          colorInputText: 'var(--foreground)',
          colorSuccess: 'var(--primary)',
          colorDanger: 'var(--destructive)',
          colorWarning: 'var(--destructive)',
          colorNeutral: 'var(--muted)',
          borderRadius: 'var(--radius)',
        },
        elements: {
          rootBox: {
            width: '100%',
          },
          cardBox: {
            width: '100%',
            boxShadow: 'none',
          },
          headerTitle: {
            color: 'var(--foreground)',
          },
          avatarImageActionsUpload: {
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            borderColor: 'var(--border)',
            borderWidth: '1px',
          },
          headerSubtitle: {
            color: 'var(--muted-foreground)',
          },
          formButtonPrimary: {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderRadius: 'var(--radius)',
            '&:hover': {
              opacity: '0.9',
            },
          },
          formButtonReset: {
            color: 'var(--muted-foreground)',
            borderRadius: 'var(--radius)',
            '&:hover': {
              backgroundColor: 'var(--muted)',
              color: 'var(--muted-foreground)',
            },
          },
          formFieldInput: {
            backgroundColor: 'var(--input)',
            color: 'var(--foreground)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)',
            '&:focus': {
              borderColor: 'var(--ring)',
              outline: '2px solid transparent',
              outlineOffset: '2px',
              boxShadow: '0 0 0 2px var(--ring)',
            },
          },
          formFieldLabel: {
            color: 'var(--foreground)',
          },
          navbarButton: {
            color: 'var(--muted-foreground)',
            borderRadius: 'var(--radius-sm)',
            '&:hover': {
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
            },
            '&[data-active="true"]': {
              backgroundColor: 'var(--clerk-accent)',
              color: 'var(--accent-foreground)',
            },
          },
          dividerLine: {
            backgroundColor: 'var(--border)',
          },
          dividerText: {
            color: 'var(--muted-foreground)',
          },
          alertText: {
            color: 'var(--foreground)',
          },
          badge: {
            backgroundColor: 'var(--secondary)',
            color: 'var(--secondary-foreground)',
            borderRadius: 'var(--radius-sm)',
          },
          identityPreview: {
            backgroundColor: 'var(--muted)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)',
          },
          identityPreviewText: {
            color: 'var(--foreground)',
          },
          identityPreviewEditButton: {
            color: 'var(--primary)',
          },
          socialButtonsBlockButton: {
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            borderRadius: 'var(--radius)',
            '&:hover': {
              backgroundColor: 'var(--muted)',
            },
          },
          profileSection: {
            borderColor: 'var(--border)',
          },
          profileSectionTitle: {
            color: 'var(--foreground)',
          },
          profileSectionContent: {
            color: 'var(--foreground)',
          },
        },
      }}
    />
  );
}
