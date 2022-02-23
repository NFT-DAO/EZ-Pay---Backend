import { IsDecimal, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  @ApiProperty({ type: String, description: 'CARDANO account to take tokens.' })
  cardanoAddress?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty({
    type: String,
    description: 'Target CARDANO account to transfer tokens to.',
  })
  cardanoAmount?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty({
    type: String,
    description: 'Amount of cardano tokens in decimal.',
  })
  fiatAmount?: number;
}
