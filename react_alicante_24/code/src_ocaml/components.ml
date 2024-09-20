module Button = struct
  external make
    : ?onClick:(React.Event.Mouse.t -> unit)
    -> ?size:string
    -> ?variant:string
    -> className:string
    -> children:React.element
    -> React.element =
      "Button" [@@mel.module "@/components/ui/button"] [@@react.component]
end
module Input = struct

  external make
    :  type_:string
    -> placeholder:string
    -> value:string
    -> onChange: (React.Event.Form.t -> unit)
    -> className:string
    -> React.element = "Input"
  [@@mel.module "@/components/ui/input"] [@@react.component]
end

module Card = struct
  external make
    : className:string
    -> children:React.element
    -> React.element = "Card"
[@@mel.module "@/components/ui/card"] [@@react.component]

module CardContent = struct
  external make
    : children:React.element
    -> React.element = "CardContent"
[@@mel.module "@/components/ui/card"] [@@react.component]
end
module CardDescription = struct
  external make
    : children:React.element
    -> React.element = "CardDescription"
[@@mel.module "@/components/ui/card"] [@@react.component]
end
module CardFooter = struct
  external make
    : children:React.element
    -> React.element = "CardFooter"
[@@mel.module "@/components/ui/card"] [@@react.component]
end

module CardHeader = struct
  external make
    : children:React.element
    -> React.element = "CardHeader"
[@@mel.module "@/components/ui/card"] [@@react.component]
end

module CardTitle = struct
  external make
    : children:React.element
    -> className:string -> React.element = "CardTitle"
[@@mel.module "@/components/ui/card"] [@@react.component]
end

end

module Badge = struct
  external make
    : children:React.element
    -> className:string
    -> React.element = "Badge"
  [@@mel.module "@/components/ui/badge"] [@@react.component]
end
