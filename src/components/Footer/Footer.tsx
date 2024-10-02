import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  InstagramLogoIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="mt-16 bg-muted px-8 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">Laget av Dag Stuan</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="mailto:d.stuan@gmail.com"
              className="text-muted-foreground hover:text-primary"
            >
              <EnvelopeClosedIcon className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
            <Link
              href="https://www.instagram.com/dagstuan"
              className="text-muted-foreground hover:text-primary"
            >
              <InstagramLogoIcon className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://github.com/dagstuan"
              className="text-muted-foreground hover:text-primary"
            >
              <GitHubLogoIcon className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
