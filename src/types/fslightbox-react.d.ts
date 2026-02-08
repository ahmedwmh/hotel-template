declare module "fslightbox-react" {
  import type { FC, ReactNode } from "react";
  interface FsLightboxProps {
    sources?: string[];
    type?: "image" | "video";
    open?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    children?: ReactNode;
    [key: string]: unknown;
  }
  const FsLightbox: FC<FsLightboxProps>;
  export default FsLightbox;
}
