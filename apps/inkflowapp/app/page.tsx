import { getServerSession } from "next-auth";
import {WsConnect} from "@/components/ui/WsConnect"

const Home = async()=>{
  const session = await getServerSession();
  return <div>
    InkFlow app
    {JSON.stringify(session)}
    <WsConnect/>
  </div>
}

export default Home