import mongoose from 'mongoose';

const waterRecordSchema = new mongoose.Schema(
  {
    // The 8 laboratory physical and chemical parameters
    ph: {
      type: Number,
      required: [true, 'pH is required'],
      min: [0, 'pH cannot be less than 0'],
      max: [14, 'pH cannot exceed 14']
    },
    turbidity: {
      type: Number,
      required: [true, 'Turbidity (NTU) is required'],
      min: [0, 'Turbidity cannot be negative']
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature (°C) is required']
    },
    do: {
      type: Number,
      required: [true, 'Dissolved Oxygen (DO mg/L) is required'],
      min: [0, 'DO cannot be negative']
    },
    bod: {
      type: Number,
      required: [true, 'Biological Oxygen Demand (BOD mg/L) is required'],
      min: [0, 'BOD cannot be negative']
    },
    lead: {
      type: Number,
      required: [true, 'Lead (mg/L) is required'],
      min: [0, 'Lead concentration cannot be negative']
    },
    mercury: {
      type: Number,
      required: [true, 'Mercury (mg/L) is required'],
      min: [0, 'Mercury concentration cannot be negative']
    },
    arsenic: {
      type: Number,
      required: [true, 'Arsenic (mg/L) is required'],
      min: [0, 'Arsenic concentration cannot be negative']
    },

    // Administrative & Geographical Metadata
    location: {
      type: String,
      trim: true,
      default: 'Main Lab'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Machine Learning Prediction Outputs
    drinkabilityScore: {
      type: Number,
      required: [true, 'drinkabilityScore is required'],
      min: 0,
      max: 100
    },
    predictedClass: {
      type: Number,
      required: [true, 'predictedClass is required'],
      enum: [0, 1, 2] // 0: Clean, 1: Moderate, 2: Polluted
    },
    riskStatus: {
      type: String,
      required: [true, 'riskStatus is required'],
      enum: ['Safe', 'Moderate', 'Critical']
    },

    // Multivariate Anomaly Detection
    isAnomaly: {
      type: Boolean,
      default: false
    },
    anomalyScore: {
      type: Number,
      default: 0
    },

    // Decision-Support Fields
    warnings: {
      type: [String],
      default: []
    },
    recommendations: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance on time-series queries
waterRecordSchema.index({ timestamp: -1 });
waterRecordSchema.index({ location: 1 });
waterRecordSchema.index({ riskStatus: 1 });

const WaterRecord = mongoose.model('WaterRecord', waterRecordSchema);
export default WaterRecord;
