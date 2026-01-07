import { StatusMember } from "../enums/statusMember";

export const StatusMemberLabel: Record<StatusMember, string> = {
    [StatusMember.NOT_VERIFIED]: "Não verificado",
    [StatusMember.ACTIVE]: "Ativo",
    [StatusMember.BLOCKED]: "Bloqueado",
};

export const StatusMemberClass: Record<StatusMember, string> = {
    [StatusMember.ACTIVE]: "text-[#005641] dark:text-[#D0F9EF]",
    [StatusMember.NOT_VERIFIED]: "text-[#594E00] dark:text-[#FDF6C2]",
    [StatusMember.BLOCKED]: "text-[#570000] dark:text-[#F9D0D0]",
};
