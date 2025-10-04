import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { MapPin, User } from 'lucide-react';
import { Bounty } from '../types/bounty';

interface BountyCardProps {
  bounty: Bounty;
}

export const BountyCard = ({ bounty }: BountyCardProps) => {
  // Add safety checks for bounty data
  if (!bounty) {
    return null;
  }

  const currentAmount = bounty.currentAmount ?? 0;
  const goalAmount = bounty.goalAmount ?? 1;
  const progress = (currentAmount / goalAmount) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ProofPending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const isCompleted = bounty.status === 'Completed';
  
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-emerald-200 flex flex-col h-full ${
      isCompleted ? 'opacity-90 bg-emerald-50 border-emerald-200' : ''
    }`}>
      <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
        {bounty.imageUrl ? (
          <img
            src={bounty.imageUrl}
            alt={bounty.title}
            className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
              isCompleted ? 'opacity-75' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <MapPin className="h-16 w-16" />
          </div>
        )}
        {isCompleted && (
          <div className="absolute inset-0 bg-emerald-500 bg-opacity-20 flex items-center justify-center">
            <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              ✓ Completed
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-2">
            {bounty.title}
          </h3>
          <Badge variant="outline" className={getStatusColor(bounty.status)}>
            {bounty.status === 'ProofPending' ? 'Proof Pending' : bounty.status}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{bounty.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="truncate">{bounty.organizerName}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">
              {currentAmount.toLocaleString()} / {goalAmount.toLocaleString()} VET
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">
            {progress.toFixed(1)}% funded
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/bounty/${bounty.id}`} className="w-full">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            View Details & Donate
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
