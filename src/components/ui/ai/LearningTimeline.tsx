import { motion } from "framer-motion";

interface TimelineItem {
  title: string;
  date: string;
  description: string;
  icon: React.ReactNode;
}

interface LearningTimelineProps {
  items: TimelineItem[];
}

export const LearningTimeline = ({ items }: LearningTimelineProps) => {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-cbpviolet-500/20 via-cbpviolet-400/30 to-transparent" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-12"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-cbpviolet-600/50 ring-4 ring-cbpgray-800">
              <div className="h-2 w-2 rounded-full bg-cbpviolet-400" />
            </div>

            {/* Date */}
            <span className="text-xs font-medium text-cbpviolet-300">
              {item.date}
            </span>

            {/* Title */}
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-cbpviolet-300">{item.icon}</span>
              <h4 className="font-medium text-cbpgray-100">{item.title}</h4>
            </div>

            {/* Description */}
            <p className="mt-1 text-sm text-cbpgray-400">{item.description}</p>

            {/* Connector line (except for last item) */}
            {index < items.length - 1 && (
              <div className="absolute -bottom-8 left-3 h-8 w-0.5 bg-cbpgray-700" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
