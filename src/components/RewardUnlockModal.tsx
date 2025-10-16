import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Gift, Star } from 'lucide-react';
import { Reward } from '../data/rewards';

interface RewardUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: Reward[];
  onClaim: (rewardId: string) => void;
}

export function RewardUnlockModal({ 
  isOpen, 
  onClose, 
  rewards, 
  onClaim 
}: RewardUnlockModalProps) {
  if (!isOpen || rewards.length === 0) return null;

  const handleClaimAll = () => {
    rewards.forEach(reward => onClaim(reward.id));
    onClose();
  };

  const getRewardTypeIcon = (type: Reward['type']) => {
    switch (type) {
      case 'color_theme':
        return '🎨';
      case 'sacred_symbol':
        return '🕉️';
      case 'background_pattern':
        return '🔷';
      default:
        return '🎁';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
              >
                🎉 Rewards Unlocked!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-400"
              >
                Your dedication has earned you {rewards.length} new {rewards.length === 1 ? 'reward' : 'rewards'}!
              </motion.p>
            </div>

            {/* Rewards List */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {rewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  {/* Reward Icon */}
                  <div className="text-3xl">
                    {getRewardTypeIcon(reward.type)}
                  </div>
                  
                  {/* Reward Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {reward.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {reward.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {reward.type.replace('_', ' ').toUpperCase()}
                      </span>
                      {reward.color && (
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: reward.color }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
              >
                View Later
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaimAll}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-medium shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" />
                  Claim All
                </div>
              </motion.button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}