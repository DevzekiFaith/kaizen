import React from "react";
// import { Link } from "react-router-dom";
import Image from "next/image";
// import { Skeleton } from "@/components/ui/skeleton"


export default function Reflectifly() {
  return (
    <div>
      <div>
        <h1>This is the About Reflectify</h1>
      </div>
      <div>
        <Image src="/cover12.jpg" width={300} height={600} alt="About" />
      </div>
    </div>
  );
}
