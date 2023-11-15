import React from "react";
import { Box, Card, CardContent, Checkbox, Typography } from "@mui/material";

interface CardProps {
  name: string;
  isChecked?: boolean;
  onCheck?: (isChecked: boolean) => void;
}

const CardComp: React.FC<CardProps> = ({ name, isChecked, onCheck }) => {
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheck) {
      onCheck(event.target.checked);
    }
  };

  return (
    <Card sx={{ width: 200, height: 100 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{height:65}}>
          <Box mt={1}>
            <Typography variant="h6" component="div">
              {name}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Checkbox checked={isChecked} onChange={handleCheck} />
            {isChecked !== undefined && (
              <Checkbox checked={!isChecked} onChange={handleCheck} />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardComp;
