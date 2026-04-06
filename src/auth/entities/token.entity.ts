import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  accessTokenExpiresAt: Date;

  @Column()
  refreshTokenExpiresAt: Date;

  @Column({ default: false })
  isBlocked: boolean;

  @Column()
  jti: string;

  // Entity1 (User) has MANY Entity2 (Token)
  @ManyToOne(() => User, (user) => user.tokens)
  user: User;

  // A one-to-many relation allows creating the type of relation where Entity1 can have multiple instances of Entity2,
  // but Entity2 has only one Entity1.
  // Entity2 is the owner of the relationship, and stores the id of Entity1 on its side of the relation.

  // ✔ The side with @ManyToOne
  //     → owns the relationship
  // → gets the foreign key column
  // → must contain the actual reference (user: User)
}
