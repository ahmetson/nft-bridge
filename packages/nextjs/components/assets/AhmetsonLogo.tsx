import React from "react";
import Image from "next/image";

export const AhmetsonLogo = ({ className }: { className: string }) => {
  return <Image alt="SE2 logo" className={className} src="/ahmetson.png" width="53" height="72" />;
};
