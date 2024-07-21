"use client"

import React, { useState, useEffect } from "react"

type Team = "blue" | "red"

interface ScoreChange {
  team: Team
  score: number
  timestamp: number
}

const PingPongBall: React.FC<{ color: string }> = ({ color }) => (
  <div
    className={`w-12 h-12 rounded-full bg-${color}-200 border-4 border-${color}-600 shadow-lg animate-bounce`}
  />
)

const Scoreboard: React.FC = () => {
  const [blueTeamScore, setBlueTeamScore] = useState(0)
  const [redTeamScore, setRedTeamScore] = useState(0)
  const [blueTeamSets, setBlueTeamSets] = useState(0)
  const [redTeamSets, setRedTeamSets] = useState(0)
  const [currentServer, setCurrentServer] = useState<Team>("blue")
  const [totalPoints, setTotalPoints] = useState(0)
  const [scoreTimeline, setScoreTimeline] = useState<ScoreChange[]>([])
  const [allTimelines, setAllTimelines] = useState<ScoreChange[][]>([])

  useEffect(() => {
    if (
      (blueTeamScore >= 11 || redTeamScore >= 11) &&
      Math.abs(blueTeamScore - redTeamScore) >= 2
    ) {
      if (blueTeamScore > redTeamScore) {
        setBlueTeamSets(blueTeamSets + 1)
      } else {
        setRedTeamSets(redTeamSets + 1)
      }
      setAllTimelines([scoreTimeline, ...allTimelines])
      setBlueTeamScore(0)
      setRedTeamScore(0)
      setTotalPoints(0)
      setScoreTimeline([])
    }
  }, [blueTeamScore, redTeamScore])

  useEffect(() => {
    if (totalPoints % 2 === 0) {
      setCurrentServer(currentServer === "blue" ? "red" : "blue")
    }
  }, [totalPoints])

  const incrementScore = (team: Team) => {
    const newScore = team === "blue" ? blueTeamScore + 1 : redTeamScore + 1
    if (team === "blue") {
      setBlueTeamScore(newScore)
    } else {
      setRedTeamScore(newScore)
    }
    setTotalPoints(totalPoints + 1)
    setScoreTimeline([
      ...scoreTimeline,
      { team, score: newScore, timestamp: Date.now() },
    ])
  }

  const resetScores = () => {
    setBlueTeamScore(0)
    setRedTeamScore(0)
    setBlueTeamSets(0)
    setRedTeamSets(0)
    setTotalPoints(0)
    setCurrentServer("blue")
    setAllTimelines([])
    setScoreTimeline([])
  }

  const sortedTimeline = [...scoreTimeline].sort(
    (a, b) => a.timestamp - b.timestamp
  )

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold my-8">탁구 경기 스코어보드</h1>
      <div className="flex w-full max-w-4xl mb-8">
        <div
          className={`flex-1 flex flex-col justify-center items-center p-8 ${
            currentServer === "blue" ? "bg-blue-600" : "bg-blue-500"
          } transition-colors duration-300 relative rounded-l-lg`}
          onClick={() => incrementScore("blue")}
        >
          <h2 className="text-4xl font-semibold mb-4">청팀</h2>
          <div className="text-9xl font-bold mb-8">{blueTeamScore}</div>
          <div className="text-3xl">세트 스코어: {blueTeamSets}</div>
          {currentServer === "blue" && (
            <div className="absolute top-4 right-4">
              <PingPongBall color="blue" />
            </div>
          )}
        </div>
        <div
          className={`flex-1 flex flex-col justify-center items-center p-8 ${
            currentServer === "red" ? "bg-red-600" : "bg-red-500"
          } transition-colors duration-300 relative rounded-r-lg`}
          onClick={() => incrementScore("red")}
        >
          <h2 className="text-4xl font-semibold mb-4">홍팀</h2>
          <div className="text-9xl font-bold mb-8">{redTeamScore}</div>
          <div className="text-3xl">세트 스코어: {redTeamSets}</div>
          {currentServer === "red" && (
            <div className="absolute top-4 left-4">
              <PingPongBall color="red" />
            </div>
          )}
        </div>
      </div>
      <button
        className="mb-8 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-2xl transition-colors duration-300"
        onClick={resetScores}
      >
        리셋
      </button>
      <div className="w-full max-w-4xl bg-gray-800 p-4 rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">점수 타임라인</h2>
        <div className="flex flex-col space-y-8">
          {[sortedTimeline, ...allTimelines].map((timeline, gameIndex) => (
            <div
              key={gameIndex}
              className={`flex flex-col space-y-2 p-4 rounded-lg ${
                gameIndex % 2 === 0 ? "bg-gray-700" : "bg-gray-600"
              }`}
            >
              <div className="flex space-x-2 h-20 relative">
                {timeline.map((entry, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <svg
                        className="absolute"
                        style={{
                          left: `${(index - 1) * 40}px`,
                          top: "0",
                          width: "48px",
                          height: "80px",
                        }}
                      >
                        <line
                          x1="16"
                          y1={timeline[index - 1].team === "blue" ? "16" : "64"}
                          x2="48"
                          y2={entry.team === "blue" ? "16" : "64"}
                          stroke={
                            timeline[index - 1].team === entry.team
                              ? entry.team === "blue"
                                ? "#93C5FD"
                                : "#FCA5A5"
                              : "#C4B5FD"
                          }
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                    <div
                      className={`absolute w-8 h-8 rounded-full ${
                        entry.team === "blue" ? "bg-blue-500" : "bg-red-500"
                      } flex items-center justify-center text-xs font-bold`}
                      style={{
                        left: `${index * 40}px`,
                        top: entry.team === "blue" ? "0px" : "48px",
                      }}
                      title={`${entry.team === "blue" ? "청팀" : "홍팀"}: ${
                        entry.score
                      }점 (${new Date(entry.timestamp).toLocaleTimeString()})`}
                    >
                      {entry.score}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Scoreboard
