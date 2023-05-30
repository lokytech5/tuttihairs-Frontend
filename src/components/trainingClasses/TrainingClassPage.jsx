import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Chip, Button, Alert, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import useTrainingClass from '../../hooks/useTrainingClass';

const CardImage = styled(CardMedia)(({ theme }) => ({
  paddingTop: '56.25%', // 16:9 Aspect Ratio
}));


export default function TrainingClassPage() {
  const navigate = useNavigate()
  const { trainingClass, loading, error } = useTrainingClass();


  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const registerButtonHandler = (classId, classPrice) => {
    navigate(`/register/${classId}`, { state: { classPrice } });
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {trainingClass.trainingClasses.map((classItem) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={classItem._id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.3)' }}>
                <CardImage image={classItem.image} alt={classItem.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                    {classItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {classItem.description}
                  </Typography>
                  <Chip color="secondary" variant="outlined" label={`${classItem.type.classType}`} sx={{ mt: 1 }} />
                  <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                    Price: ${classItem.type.price}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', pt: 2, mb: 10 }}>
                  <Button variant="contained" color="primary" onClick={() => registerButtonHandler(classItem._id, classItem.type.price)}>
                    Register
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

    </>
  )
};
