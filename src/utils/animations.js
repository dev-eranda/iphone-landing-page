import gsap from "gsap";

import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

export const animateWithGsapTimeline = (
  timeline,
  rotationRef,
  rotationState,
  firstTarget,
  secondTarget,
  aniamtionProps
) => {
  if (!timeline) {
    console.error(
      "Timeline is undefined. Make sure you are passing a valid GSAP timeline."
    );
    return;
  }

  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  timeline.to(
    firstTarget,
    {
      ...aniamtionProps,
      ease: "power2.inOut",
    },
    "<"
  );

  timeline.to(
    secondTarget,
    {
      ...aniamtionProps,
      ease: "power2.inOut",
    },
    "<"
  );
};
