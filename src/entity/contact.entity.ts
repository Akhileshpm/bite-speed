import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id:number;       
    
    @Column({ nullable: true })
    phoneNumber:string;          

    @Column({ nullable: true })
    email:string;

    @Column({ nullable: true })
    linkedId:number;

    @Column()
    linkPrecedence:string;      

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
};