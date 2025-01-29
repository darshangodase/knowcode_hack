import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-cards";
import Card from "./ui/card";

export function Impact() {
    return (
        <div className="py-20 font-rubik">
            <CardContainer className="inter-var" containerClassName="">
                <CardBody className="relative bg-white dark:bg-black border border-neutral-200 dark:border-white/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-6">
                    <CardItem
                        translateZ={50}
                        className="text-xl pl-5 font-bold text-neutral-600 dark:text-white"
                    >
                        Environmental Impact!
                    </CardItem>
                    <CardItem
                        as="p"
                        translateZ={60}
                        className="text-neutral-500 pl-8 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                        VJoin us in reducing electronic waste by recycling responsibly. Contribute to a cleaner, greener planet by recycling your e-waste today!
                    </CardItem>
                    <CardItem translateZ={100} className="w-full mt-4">
                        <Card />
                    </CardItem>
                    <div className="flex justify-between items-center mt-20">
                        <CardItem
                            translateZ={20}
                            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                        >
                            Try out our Website
                        </CardItem>
                        <CardItem
                            translateZ={20}
                            as="button"
                            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                        >
                            Let's Begin →
                        </CardItem>
                    </div>
                </CardBody>
            </CardContainer>
        </div>
    );
}