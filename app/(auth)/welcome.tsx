import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';

import { useTranslation } from '@/shared/i18n';

import ChatIcon from '@/assets/icons/chat-chat-svgrepo-com.svg';
import EyePasswordIcon from '@/assets/icons/eye-password-eye-password-svgrepo-com.svg';
import PencilIcon from '@/assets/icons/pencil-revision-svgrepo-com.svg';
import PersonalAccountIcon from '@/assets/icons/personal-account-account-svgrepo-com.svg';
import SettingIcon from '@/assets/icons/setting-svgrepo-com.svg';
import ToolboxIcon from '@/assets/icons/toolbox-svgrepo-com.svg';

function IconCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="w-[90%] h-32 items-center justify-center bg-base-white rounded-2xl shadow-sm">
      {children}
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1 bg-base-white" showsVerticalScrollIndicator={false}>
      <View className="flex-1 px-6 pt-16 pb-8 min-h-screen">
        <View className="flex-1 justify-center mb-8">
          <View className="flex-row justify-between">
            <View className="flex-1 items-center gap-4 -mt-6">
              <IconCard>
                <PersonalAccountIcon width={40} height={40} />
              </IconCard>

              <IconCard>
                <ChatIcon width={40} height={40} />
              </IconCard>

              <IconCard>
                <EyePasswordIcon width={40} height={40} />
              </IconCard>
            </View>

            <View className="flex-1 items-center gap-4 mt-6">
              <IconCard>
                <ToolboxIcon width={40} height={40} />
              </IconCard>

              <IconCard>
                <SettingIcon width={40} height={40} />
              </IconCard>

              <IconCard>
                <PencilIcon width={40} height={40} />
              </IconCard>
            </View>
          </View>
        </View>

        <View className="mt-auto gap-4">
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center justify-center"
            onPress={() => router.replace('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text className="text-base-white text-lg font-semibold">
              {t('auth.welcome.signIn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center justify-center"
            onPress={() => router.replace('/(auth)/sign-up')}
            activeOpacity={0.8}
          >
            <Text className="text-base-white text-lg font-semibold">
              {t('auth.welcome.signUp')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
