import { Column, Entity, Index, JoinColumn, ManyToOne, BeforeInsert } from "typeorm"
import { Organisation } from "./organisation";
import { BaseEntity } from "@ocular-ai/types";
import { DbAwareColumn } from "../../../utils/src/db-aware-column";
import { generateEntityId } from "../utils/generate-entity-id";

/**
 * @enum
 * 
 * The user's role.
 */
export enum UserRoles {
  /**
   * The user is an admin.
   */
  ADMIN = "admin",
  /**
   * The user is a team member.
   */
  MEMBER = "member",
}

@Entity()
export class User extends BaseEntity {
  @DbAwareColumn({
    type: "enum",
    enum: UserRoles,
    nullable: true,
    default: UserRoles.MEMBER,
  })
  role: UserRoles

  @Index({ unique: true })
  @Column({ type: "varchar" })
  email: string

  @Column({ type: "varchar",nullable: true })
  first_name: string

  @Column({ type: "varchar", nullable: true })
  last_name: string

    /**
   * @apiIgnore
   */
    @Column({ nullable: true, select: false })
    password_hash: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Index("UserOrganisationId")
  @Column({ type: "varchar", nullable: true })
  organisation_id?: string;

  @ManyToOne(() => Organisation, (organisation) => organisation.members)
  @JoinColumn({ name: 'organisation_id', referencedColumnName: 'id' })
  organisation?: Organisation;

  /**
  * @apiIgnore
  */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "usr")
  }
}