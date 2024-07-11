<script setup>
import avatar1 from "@images/avatars/avatar-1.png";
import avatar4 from "@images/avatars/avatar-1.png";
import avatar8 from "@images/avatars/avatar-1.png";

const solidCardData = [
  {
    cardBg: "#16B1FF",
    title: "Twitter Card",
    icon: "bxl-twitter",
    text: '"Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well."',
    avatarImg: avatar4,
    avatarName: "Bùi Văn Thành",
    likes: "1.2k",
    share: "80",
  },
  {
    cardBg: "#3B5998",
    title: "Facebook Card",
    icon: "bxl-facebook",
    text: "You've read about the importance of being courageous, rebellious and imaginative. These are all vital ingredients.",
    avatarImg: avatar1,
    avatarName: "Eugene Clarke",
    likes: "3.2k",
    share: "49",
  },
  {
    cardBg: "#007BB6",
    title: "Linkedin Card",
    icon: "bxl-linkedin",
    text: "With the Internet spreading like wildfire and reaching every part of our daily life, more and more traffic is directed.",
    avatarImg: avatar8,
    avatarName: "Anne Burke1",
    likes: "1.2k",
    share: "80",
  },
  {
    cardBg: "#007BB6",
    title: "Linkedin Card",
    icon: "bxl-linkedin",
    text: "With the Internet spreading like wildfire and reaching every part of our daily life, more and more traffic is directed.",
    avatarImg: avatar8,
    avatarName: "Anne Burke1",
    likes: "1.2k",
    share: "80",
  },
];
</script>

<template>
  <VRow>
    <VCol
      v-for="data in solidCardData"
      :key="data.icon"
      cols="12"
      md="6"
      lg="6"
    >
      <VCard :color="data.cardBg" class="pa-5">
        <v-row>
          <v-col :cols="4">
            <VImg
              :width="116"
              height="100%"
              :src="data.avatarImg"
              class="rounded"
            />
          </v-col>
          <v-col :cols="8">
            <div class="text-white">{{ data.avatarName }}</div>
            <div class="text-white">Phòng IT</div>
            <div class="text-white">{{ data.avatarName }}</div>
            <div
              class="d-flex align-center"
              style="margin-left: -10px; height: 24px"
            >
              <IconBtn icon="bx-time" color="white" />
              <span class="text-subtitle-2 text-white me-4"
                >08:00 01-01-2024</span
              >
            </div>
          </v-col>
        </v-row>
      </VCard>
    </VCol>
  </VRow>
</template>
