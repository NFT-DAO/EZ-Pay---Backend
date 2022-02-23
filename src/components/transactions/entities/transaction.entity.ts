import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transactions extends Document {
  @Prop({ required: true, unique: true })
  payment_id: string;

  @Prop({ required: true })
  fiat_amount: string;

  @Prop({ required: true })
  ada_address: string;

  @Prop({ required: true })
  quantity: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({
    required: true,
    default: 'pending',
    enum: ['pending', 'success', 'rejected', 'insufficient'],
  })
  transactionStatus: string;

  @Prop({})
  cardanoTransactionId: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transactions);
