module React = struct 
  type element =
   | Empty
   | Text of string
   | Lower_case_element of lower_case_element
   | Upper_case_component of (unit -> element)
   | Async_component of (unit -> element Lwt.t)
   | InnerHtml of string
   | Fragment of element array
   | Provider of element
   | Consumer of element
   | Suspense of { children : element; fallback : element }
end
