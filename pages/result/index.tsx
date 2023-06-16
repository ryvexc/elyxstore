import Background from "@/components/Background";
import Heading from "@/components/Heading";
import React from "react";

export async function getServerSideProps({ query }: any) {
  return {
    props: {
      success: query.success,
    },
  };
}

export default function handler({ success }: { success: string }): JSX.Element {
  const handleRedirect: Function = (e: any): string =>
    (window.location.href = "/login");

  return (
    <>
      <Background />
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="overflow-hidden flex flex-col p-7 bg-[#ffffff13] rounded-xl backdrop-blur-3xl">
          {success == "true" ? (
            <Heading className="text-[20px]">
              Account Created Successfully!
            </Heading>
          ) : (
            <Heading className="text-[20px]">Account Creation Failed!</Heading>
          )}
          <p
            className="text-sm font-light cursor-pointer mt-1 text-blue-500 hover:underline underline-offset-2"
            onClick={(e: any) => handleRedirect(e)}
          >
            &lt; Back to login
          </p>
        </div>
      </div>
    </>
  );
}
