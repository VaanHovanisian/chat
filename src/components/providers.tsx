import { SessionProvider } from "next-auth/react";

interface Props {
  children?: React.ReactNode;
}

export const Providers: React.FC<Props> = (props) => {
  const { children } = props;
  return <SessionProvider>{children}</SessionProvider>;
};
