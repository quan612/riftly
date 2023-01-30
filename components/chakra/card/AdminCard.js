import Card from "@components/chakra/card/Card";

import {

  useColorModeValue,

} from "@chakra-ui/react";

export default function AdminCard({ children }) {
  const bg = useColorModeValue("white", "#1B254B");
  const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");

  return (
    <Card boxShadow={shadow} py="4" bg={bg}>{children}</Card>
  )
}