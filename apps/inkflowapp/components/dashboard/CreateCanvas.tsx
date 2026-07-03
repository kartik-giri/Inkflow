"use client";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/cardWrapper";
import Heading from "../ui/heading";
import { useRef } from "react";

const CreateCanvas = ({setClose}:{setClose:(state:boolean)=>void}) => {

    const inputRef = useRef()
    return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="text-center w-10/12 md:w-4/12">
        <div className="flex justify-end pb-5 cursor-pointer" onClick={()=>{
            setClose(false)
        }}>
          <X />
        </div>

        <Heading classname="font-bold">New Canvas</Heading>

        <input
           ref={inputRef}
          type="text"
          placeholder="Canvas name..."
          className="border rounded-md mt-15 mb-5 h-10 p-2 w-full"
        />
        <Button className=" w-full">Create Room</Button>
      </Card>
    </section>
  );
};

export default CreateCanvas;
