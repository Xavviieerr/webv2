"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[url('/placeholder-gey92.png')] opacity-5 bg-cover bg-center" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              Scholarship to Study <span className="text-primary">Urhobo Language</span> – Apply Now
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            Join our groundbreaking program to Revive and promote the rich heritage of the Urhobo language. Study with
            expert instructors and continue your education at Delta State University.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button className="text-lg px-8 py-6">
              <Link href="/apply">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/scholarship">Learn More</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Expert Instruction</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Learn from qualified Urhobo language experts and cultural historians
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Community Focus</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Connect with fellow students and the broader Urhobo community
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">DELSU Partnership</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Continue your studies at Delta State University upon completion
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;