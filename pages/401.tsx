import Background from "@/components/Background";
import Heading from "@/components/Heading";
import Link from "next/link";
import Head from "next/head";

export default function Unauthorized(): JSX.Element {
  return <>
    <Head>
      <title>Unauthorized</title>
    </Head>
    <div>
      <Background />
      <div className="animate__animated animate__fadeIn flex justify-center items-center w-screen h-screen">
        <div className="overflow-hidden flex flex-col p-7 bg-[#ffffff13] rounded-xl backdrop-blur-3xl">
          <Heading className="text-[20px]">
            401 <span className="mx-2">|</span> Unauthorized
          </Heading>
          <Link
            href="/login"
            className="text-sm font-light cursor-pointer mt-1 text-blue-500 hover:underline underline-offset-2"
          >
            &lt; Go back to login
          </Link>
        </div>
      </div>
    </div>
  </>
}
