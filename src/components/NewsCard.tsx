import Link from "next/link"
import Image from "next/image"
import type { NewsArticle } from "@/types"
import { Badge } from "./ui/badge"
import { formatDate } from "@/utils"
import { Card } from "@/components/ui/Card"
import CardContent from "./ui/CardContent"
import CardHeader from "./ui/CardHeader"

interface NewsCardProps {
  article: NewsArticle
  featured?: boolean
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/community/news/${article.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            width={featured ? 800 : 400}
            height={featured ? 400 : 250}
            className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {article.category}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{formatDate(article.date)}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
          <h3
            className={`font-bold leading-tight group-hover:text-primary transition-colors ${
              featured ? "text-2xl md:text-3xl" : "text-lg"
            }`}
          >
            {article.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{article.excerpt}</p>
        </CardContent>
      </Link>
    </Card>
  )
}
