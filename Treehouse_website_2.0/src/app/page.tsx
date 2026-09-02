import { TreeHouseScene } from "@/components/treehouse/scene";

/**
 * TreeHouse Studio — single immersive route.
 *
 * The whole experience lives on `/` and is composed of data-driven,
 * self-contained components under src/components/treehouse. To extend
 * it (more portfolio pieces, social links, or views) edit the files in
 * src/components/treehouse/data — no markup changes required.
 */
export default function Home() {
  return <TreeHouseScene />;
}
