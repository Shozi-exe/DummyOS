import { useState } from "react"

const Terminal = () => {
  const arr = [
    {
      cmd:"whoami",
      res:"Shozab"
    },
    {
      cmd:"test2",
      res:"test2 working..."
    },
    {
      cmd:"help",
      res:"whoami \ncls \ndate \ncolor 1  \ncolor 0"
    }
  ]
  const[history , setHistory] = useState([])
  const [cmdin , setCmdin] = useState<string>("")
  const[clr,setClr] = useState<boolean>(false)


  const runcmd = (Val)=>{

  const val = Val.trim().toLowerCase()

    if(val === "cls"){
      setHistory([])
      setCmdin("")
    }
    else if(val === "color 1"){
      setClr(true)
      setCmdin("")
    }
    else if(val === "color 0"){
      setClr(false)
      setCmdin("")
    }
    else if(val === "date"){
      setHistory([...history, {cmd:"date" , res: new Date().toDateString()}])
      setCmdin("")
    }
    else{
    const command = arr.find((el)=>el.cmd === val)
    if(command){
      setHistory([...history , {cmd : val , res: command.res}])
      setCmdin("")
    }
  }
}

  return (
    <div className={`h-full w-full p-3 font-mono bg-black ${clr === true ? "text-green-500" : "text-white"}`} >
      <div className="h-full overflow-auto scrollbar-none">
      <div className="text-sm mb-4">
        <p>shozi0S Terminal [ v 9.1.1 ]</p>
        <p>Copyright (c) 2026 Shozab. No rights reserved.</p>
      </div>

      <div className="w-full">
        {history.map((h,i)=> {
          return (
            <div className="text-sm my-2" key={i}>
              <p className="mb-1">C:/shoziOS/sys69&gt;{h.cmd}</p>
              <p className="whitespace-pre-line">{h.res}</p>
            </div>
          )
        })}
      </div>

      <div className="w-full flex text-sm">
        <p className="w-fit mr-1 whitespace-nowrap">C:/shoziOS/sys69&gt;</p>
        <input autoFocus={true} type="text" value={cmdin} className=" h-5 w-full text-wrap outline-none" onChange={(e)=>{
          setCmdin(e.target.value)
        }}
        onKeyDown={(e)=>{
          e.key === "Enter" && runcmd(cmdin)
        }}
        />
      </div>
      </div>
    </div>
  )
}

export default Terminal