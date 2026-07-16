"use client";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/cardWrapper";
import Heading from "../ui/heading";
import { useRef, useState } from "react";
import {  useRouter } from "next/navigation";


const CreateCanvas = ({ setClose }: { setClose: (state: boolean) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()
  const [isLoading, setLoading] = useState<boolean>(false);
  
  const createRoom = async()=>{
    setLoading(true)
    const slug = inputRef.current!.value;
    if(!slug){
        setLoading(false)
        return
    }
    try{
        const res = await fetch("/api/v1/room",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({slug:slug})
        })

        if(!res.ok){
            throw new Error("Error occured while creating canvas/room")
        }

        setClose(false)
        router.refresh() //I can also open new route canvas[slug] after creating new canvas
    }
    catch(err){
        console.log(`Error occured while creating canvas/room`,err)
    } finally{
        setLoading(false)
    }
  }


  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="text-center w-10/12 md:w-4/12">
        <div
          className="flex justify-end pb-5 cursor-pointer"
          onClick={() => {
            setClose(false);
          }}
        >
          <X />
        </div>

        <Heading classname="font-bold">New Canvas</Heading>

        <input
          ref={inputRef}
          type="text"
          placeholder="Canvas name..."
          className="border rounded-md mt-15 mb-5 h-10 p-2 w-full"
        />
        <Button disabled={isLoading} onClick={()=>{
            createRoom()
        }} className=" w-full">{isLoading?"Creating Room...":"Create Room"}</Button>
      </Card>
    </section>
  );
};

export default CreateCanvas;
