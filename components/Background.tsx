import React from "react";

export interface IBackgroundProps {
  className?: string | null;
}

// prettier-ignore
export default function Background({ className }: IBackgroundProps): JSX.Element {
	const rPurp: React.RefObject<HTMLObjectElement> = React.useRef<HTMLObjectElement>(null);
	const lBlue: React.RefObject<HTMLObjectElement> = React.useRef<HTMLObjectElement>(null);
	
	async function lifeCycleAnimation(): Promise<any> {
		const lBlueObj: HTMLObjectElement = lBlue.current as HTMLObjectElement;
		const rPurpObj: HTMLObjectElement = rPurp.current as HTMLObjectElement;
		
		while (true) {
			await (async (): Promise<any> => {
				lBlueObj.classList.remove("animate__fadeOut");
				lBlueObj.classList.remove("animate__slower");
				lBlueObj.classList.add("animate__slow");
				lBlueObj.classList.add("animate__fadeInDown");
				await new Promise((resolve: Function): number => setTimeout(resolve, 200));
				rPurpObj.classList.remove("animate__fadeOut");
				rPurpObj.classList.remove("animate__slower");
				rPurpObj.classList.add("animate__slow");
				rPurpObj.classList.add("animate__fadeInDown");
				await new Promise((resolve: Function): number => setTimeout(resolve, 1800));

				lBlueObj.classList.remove("animate__fadeInDown");
				lBlueObj.classList.remove("animate__slow");
				lBlueObj.classList.add("animate__slower");
				lBlueObj.classList.add("animate__fadeOut");
				await new Promise((resolve: Function): number => setTimeout(resolve, 200));
				rPurpObj.classList.remove("animate__fadeInDown");
				rPurpObj.classList.remove("animate__slow");
				rPurpObj.classList.add("animate__slower");
				rPurpObj.classList.add("animate__fadeOut");
				await new Promise((resolve: Function): number => setTimeout(resolve, 1800));
			})();
		}
	}
	
	React.useEffect((): void => {
		lifeCycleAnimation();
	}, [])
	
	// prettier
  return (
    <div className={`-z-10 ${className} fixed top-0 left-0 h-screen w-screen`}>
      <div className="-z-[9] absolute h-full w-full bg-[#040105]">
				<div ref={lBlue} className="animate__animated animate__fadeInDown animate__slow -z-[8] absolute -top-14 -left-14 rounded-full bg-[#2a1674] w-96 h-96"></div>
				<div className="animate__animated -z-[8] absolute right-28 bottom-26 rounded-full opacity-40 bg-[#4329a0] w-[500px] h-[500px]"></div>
        <div ref={rPurp} className="animate__animated animate__fadeInLeft animate__slow -z-[8] absolute right-0 bottom-0 rounded-full bg-[#3c044d] w-[500px] h-[500px]"></div>
        <div className="-z-[8] absolute left-0 bottom-0 rounded-full bg-[#1e0425] w-[500px] h-[500px]"></div>
      </div>
      <div className="-z-[7] backdrop-blur-[150px] absolute h-screen w-screen"></div>
    </div>
  );
}
