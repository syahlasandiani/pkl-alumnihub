// // src/components/shared/HeaderAnimation.tsx
// "use client";

// import { motion } from "framer-motion";

// export default function HeaderAnimation({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <motion.header
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ delay: 0.2, type: "spring" }}
//       className="fixed top-0 left-0 w-full z-50"
//     >
//       {children}
//     </motion.header>
//   );
// }