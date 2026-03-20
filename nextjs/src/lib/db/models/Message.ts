import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Message interface
export interface Message {
  requester: Types.ObjectId;
  offerer: Types.ObjectId;
  titleMessage: string;
  bodyMessage: string;
  attachment: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Document interface
export interface MessageDocument extends Message, Document {
  _id: Types.ObjectId;
}

// Model interface
export interface MessageModel extends Model<MessageDocument> {}

const messageSchema = new Schema<MessageDocument>(
  {
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offerer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    titleMessage: { type: String, required: true },
    bodyMessage: { type: String, required: true },
    attachment: { type: String, required: true, uppercase: true },
    read: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const MessageModel =
  (mongoose.models.Message as MessageModel) ||
  mongoose.model<MessageDocument, MessageModel>('Message', messageSchema);

export default MessageModel;
