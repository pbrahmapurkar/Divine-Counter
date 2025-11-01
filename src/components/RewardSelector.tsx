import React from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle, Star } from 'lucide-react';
import { Reward } from '../data/rewards';

interface RewardSelectorProps {
  rewards: Reward[];
  selectedRewardId?: string;
  onSelectReward: (rewardId: string) => void;
  type: 'color_theme' | 'sacred_symbol' | 'background_pattern';
  title: string;
}

export function RewardSelector({ 
  rewards, 
  selectedRewardId, 
  onSelectReward, 
  type,
  title 
}: RewardSelectorProps) {
  const filteredRewards = rewards.filter(reward => reward.type === type);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {filteredRewards.map((reward, index) => {
          const isUnlocked = reward.isUnlocked;
          const isSelected = selectedRewardId === reward.id;

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isUnlocked
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
              }`}
              onClick={() => isUnlocked && onSelectReward(reward.id)}
            >
              {/* Status Icon */}
              <div className="absolute top-2 right-2">
                {isUnlocked ? (
                  isSelected ? (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Star className="w-5 h-5 text-yellow-500" />
                  )
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Reward Icon */}
              <div className="text-3xl mb-3 text-center">
                {reward.icon}
              </div>

              {/* Reward Info */}
              <div className="space-y-2">
                <h4 className={`text-sm font-semibold text-center ${
                  isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {reward.name}
                </h4>
                
                <p className={`text-xs text-center ${
                  isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {reward.description}
                </p>

                {/* Color Preview for Color Themes */}
                {type === 'color_theme' && reward.color && (
                  <div className="flex justify-center mt-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: reward.color }}
                    />
                  </div>
                )}

                {/* Unlock Condition */}
                {!isUnlocked && (
                  <div className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
                    {reward.unlockCondition.type === 'streak_days' && 
                      `Unlock at ${reward.unlockCondition.value} day streak`
                    }
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Unlock Progress */}
      {filteredRewards.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Unlocked Rewards</span>
            <span>
              {filteredRewards.filter(r => r.isUnlocked).length} / {filteredRewards.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(filteredRewards.filter(r => r.isUnlocked).length / filteredRewards.length) * 100}%` 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}













