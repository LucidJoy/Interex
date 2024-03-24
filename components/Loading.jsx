import React from "react";
import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <LoaderCircle className='h-6 w-6 text-muted-foreground animate-spin duration-1000' />
  );
};

export default Loading;
