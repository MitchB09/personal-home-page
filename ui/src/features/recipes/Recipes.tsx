import { type JSX } from "react"

import { Box, Paper } from "@mui/material"
import { useGetRecipesQuery } from "./recipeApiSlice"

const homeTab = "list"

export const Recipes = (): JSX.Element => {
  const { data /* isError, isLoading isSuccess */ } =
    useGetRecipesQuery("")

  if (!data) {
    return <>Loading...</>
  }

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        
      </Box>
      <Box key={homeTab} sx={{ height: "100%" }}>
        Home
      </Box>

    </Paper>
  )
}
