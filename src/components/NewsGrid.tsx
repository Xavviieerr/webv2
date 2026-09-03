import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "./ui/badge"
import Image from "next/image"
import { getAllNewsItems } from "@/data/news-data"
import { Card } from "@/components/ui/Card"
import CardContent from "./ui/CardContent"
import CardFooter from "./ui/CardFooter"
import CardHeader from "./ui/CardHeader"

const MAX_NEWS_ITEMS = 6
export default function NewsGrid() {
  const newsItems = getAllNewsItems()
  newsItems.length = MAX_NEWS_ITEMS
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News & Updates</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Stay informed with the most recent developments in education and scholarship opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <Link key={item.id} href={`/community/news/${item.id}`}>
              <Card className="flex justify-between flex-col group hover:shadow-lg border border-[#d7d7d7] hover:bg-[#07363a] hover:text-white transition-all duration-300 cursor-pointer h-full">
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <Image
                    fill
                  src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.excerpt}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.readTime}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />

                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        <div className="my-7 flex md:justify-end justify-center">
          <Link href={''} className="underline">More news</Link>
        </div>
      </div>
    </section>
  )
}
