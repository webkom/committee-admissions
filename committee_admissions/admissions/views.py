from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.db.models import Prefetch
from django.views.generic.base import TemplateView
from rest_framework import permissions, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from committee_admissions.admissions import constants
from committee_admissions.admissions.models import (
    Admission, Committee, CommitteeApplication, UserApplication
)
from committee_admissions.admissions.serializers import (
    AdminAdmissionSerializer, AdmissionPublicSerializer, ApplicationCreateUpdateSerializer,
    CommitteeApplicationSerializer, CommitteeSerializer, UserApplicationSerializer, UserSerializer
)

from .models import Membership
from .permissions import AdmissionPermissions, ApplicationPermissions, CommitteePermissions


class AppView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['settings'] = settings
        return context


class AdmissionViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = Admission.objects.all()
    permission_classes = [AdmissionPermissions]

    def get_serializer_class(self):
        if self.action == 'list':
            user = self.request.user
            if user and user.is_staff:
                return AdminAdmissionSerializer

        return AdmissionPublicSerializer


class CommitteeViewSet(viewsets.ModelViewSet):
    queryset = Committee.objects.all()
    serializer_class = CommitteeSerializer
    permission_classes = [CommitteePermissions]


class ApplicationViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = UserApplication.objects.all().select_related("admission", "user")
    serializer_class = ApplicationCreateUpdateSerializer
    permission_classes = [ApplicationPermissions]

    def get_queryset(self):
        user = self.request.user
        if Membership.objects.filter(
            user=user,
            role=constants.LEADER,
            abakus_group__name="Hovedstyret",
        ).exists():
            return super().get_queryset().prefetch_related(
                'committee_applications', 'committee_applications__committee'
            )
        # Works, but crashes for normal users
        group = Membership.objects.filter(user=user, role=constants.LEADER).first().abakus_group

        qs = CommitteeApplication.objects.filter(committee__name=group.name
                                                 ).select_related('committee')

        return super().get_queryset().filter(committee_applications__committee__name=group.name
                                             ).prefetch_related(
                                                 Prefetch(
                                                     'committee_applications', queryset=qs,
                                                     to_attr='committee_applications_filtered'
                                                 )
                                             )

    def get_serializer_class(self):
        if self.action in ('create'):
            return ApplicationCreateUpdateSerializer
        return UserApplicationSerializer

    def perform_create(self, serializer):
        print(self.request.user)
        serializer.save(user=self.request.user)

    @list_route(methods=['GET'])
    def mine(self, request):
        instance = UserApplication.objects.get(user=request.user)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
