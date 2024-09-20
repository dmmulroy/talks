'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Search } from "lucide-react"

type DomainStatus = "available" | "taken" | "premium"

interface TldOption {
  tld: string
  status: DomainStatus
  price: number | null
}

interface DomainResult extends TldOption {
  name: string
}

export function DomainSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<DomainResult[]>([])

  const tldOptions: TldOption[] = [
    { tld: ".com", status: "available", price: 10.99 },
    { tld: ".net", status: "available", price: 9.99 },
    { tld: ".org", status: "taken", price: null },
    { tld: ".io", status: "premium", price: 39.99 },
    { tld: ".ai", status: "available", price: 69.99 },
    { tld: ".app", status: "available", price: 12.99 },
  ]

  const handleSearch = () => {
    if (searchTerm) {
      const results: DomainResult[] = tldOptions.map(option => ({
        name: `${searchTerm}${option.tld}`,
        ...option
      }))
      setSearchResults(results)
    }
  }

  const getStatusColor = (status: DomainStatus): string => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "taken":
        return "bg-red-500"
      case "premium":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-10 w-10 text-white mr-2" />
            <h1 className="text-3xl font-bold">Domain Finder</h1>
          </div>
          
          <div className="flex space-x-2 mb-8">
            <Input
              type="text"
              placeholder="Enter your domain name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow text-lg bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
            <Button onClick={handleSearch} size="lg" className="bg-white text-black hover:bg-gray-200">
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((domain) => (
                <Card key={domain.name} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{domain.name}</CardTitle>
                    <CardDescription>
                      <Badge className={`${getStatusColor(domain.status)} text-black`}>
                        {domain.status}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {domain.status === "available" && domain.price && (
                      <p className="text-2xl font-bold text-green-400">${domain.price.toFixed(2)}/year</p>
                    )}
                    {domain.status === "premium" && domain.price && (
                      <p className="text-2xl font-bold text-yellow-400">${domain.price.toFixed(2)}/year</p>
                    )}
                    {domain.status === "taken" && (
                      <p className="text-lg text-red-400">Not available</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    {domain.status === "available" && (
                      <Button className="w-full bg-white text-black hover:bg-gray-200">Register Now</Button>
                    )}
                    {domain.status === "premium" && (
                      <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-600">Make Offer</Button>
                    )}
                    {domain.status === "taken" && (
                      <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">View Details</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}