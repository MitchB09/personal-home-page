import { useCallback, useMemo, type JSX } from "react"

import { format } from "date-fns"
import {
  type Game,
  type GameCompetitor,
  CompetitorType,
  GameStatusEnum,
} from "../types"
import { Grid, Paper } from "@mui/material"

export type BoxScoreProps = {
  game: Game
}

const getCompetitor = (game: Game, type: CompetitorType) => {
  const competitors = game.competitions[0].competitors
  return competitors.find(competitor => competitor.homeAway === type)
}

export const BoxScore = (props: BoxScoreProps): JSX.Element => {
  const { game } = props

  const homeTeam = useMemo((): GameCompetitor => {
    const homeTeam = getCompetitor(game, CompetitorType.HOME)
    if (homeTeam) {
      return homeTeam
    } else {
      throw new Error("No home team found")
    }
  }, [game])

  const awayTeam = useMemo((): GameCompetitor => {
    const awayTeam = getCompetitor(game, CompetitorType.AWAY)
    if (awayTeam) {
      return awayTeam
    } else {
      throw new Error("No away team found")
    }
  }, [game])

  const renderCard = useCallback((team: GameCompetitor, game: Game) => {
    return (
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        flexDirection={
          team.homeAway === CompetitorType.AWAY ? "row" : "row-reverse"
        }
      >
        <Grid>
          <img src={team.team.logo} height="22px" width="22px" />
        </Grid>
        <Grid>{team.team.abbreviation}</Grid>
        {game.status.type.name !== GameStatusEnum.STATUS_SCHEDULED && (
          <Grid>{team.score}</Grid>
        )}
      </Grid>
    )
  }, [])

  return (
    <Paper sx={{ height: "5em", margin: "0.5em", padding: "1em", paddingRight: '2em' }}>
      <Grid
        container
        height="100%"
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        alignContent="center"
      >
        <Grid sx={{ textAlign: "left" }}>
          {format(new Date(game.date), "h:mm aa")}
        </Grid>
        <Grid size={3}>{renderCard(awayTeam, game)}</Grid>
        <Grid size={3} container direction="column" spacing={0} alignItems="center">
          <Grid>@</Grid>
          {game.status.type.name !== GameStatusEnum.STATUS_SCHEDULED && (
            <Grid>{game.status.type.shortDetail}</Grid>
          )}
        </Grid>
        <Grid size={3}>{renderCard(homeTeam, game)}</Grid>
      </Grid>
    </Paper>
  )
}
