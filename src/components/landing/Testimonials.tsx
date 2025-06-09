import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
    {
        name: "Alex Thompson",
        username: "@alexthompson",
        body: "Resynk's AI suggestions made crafting my resume so effortless. Got three interviews in the first week!",
        img: "https://avatar.vercel.sh/alexthompson",
    },
    {
        name: "Sarah Chen",
        username: "@sarahc_tech",
        body: "The ATS optimization feature is a game-changer. Finally passed through those automated systems!",
        img: "https://avatar.vercel.sh/sarahc",
    },
    {
        name: "Michael Rodriguez",
        username: "@mrodriguez",
        body: "Love the real-time preview. Makes editing so intuitive. The templates are absolutely professional.",
        img: "https://avatar.vercel.sh/mrodriguez",
    },
    {
        name: "Emma Patel",
        username: "@emmapatel",
        body: "Collaborated with my career coach seamlessly. The secure sharing feature is exactly what I needed.",
        img: "https://avatar.vercel.sh/emmapatel",
    },
    {
        name: "David Kim",
        username: "@davidk",
        body: "50+ templates and AI-powered content suggestions made my resume stand out. Landed my dream job!",
        img: "https://avatar.vercel.sh/davidk",
    },
    {
        name: "Lisa Wang",
        username: "@lwang",
        body: "The AI content optimization is brilliant. My resume now perfectly highlights my achievements.",
        img: "https://avatar.vercel.sh/lwang",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

export function Testimonials() {
    return (
        <section className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Join thousands of developers who trust ReSync for their data synchronization needs
                </p>
            </div>

            <div className="relative flex w-full max-w-7xl mx-auto flex-col items-center justify-center overflow-hidden bg-transparent rounded-4xl">
                <Marquee pauseOnHover className="[--duration:20s] bg">
                    {firstRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:20s]">
                    {secondRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
            </div>

            <div className="text-center mt-12">
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    See more testimonials →
                </a>
            </div>
        </section>
    );
}
